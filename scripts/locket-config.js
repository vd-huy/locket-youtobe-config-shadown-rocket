(function () {
  var body = $response.body;
  // The Firebase SDK may use its own User-Agent; the project path identifies Locket.
  if (
    !/^https:\/\/firebaseremoteconfig\.googleapis\.com\/v1\/projects\/locket-4252a\//i.test(
      $request.url || "",
    )
  ) {
    console.log("[locket-config] skipped: not the Locket Firebase project");
    return $done({ body: body });
  }
  try {
    var data = JSON.parse(body);
    if (
      !data ||
      typeof data !== "object" ||
      Array.isArray(data) ||
      (data.state !== undefined && data.state !== "UPDATE")
    ) {
      console.log("[locket-config] skipped: invalid or unchanged response");
      return $done({ body: body });
    }
    if (data.entries === undefined) data.entries = {};
    if (
      !data.entries ||
      typeof data.entries !== "object" ||
      Array.isArray(data.entries)
    ) {
      console.log("[locket-config] skipped: entries missing or invalid");
      return $done({ body: body });
    }
    var e = data.entries;
    function merge(key, changes) {
      var old = {};
      try {
        old = JSON.parse(e[key] === undefined ? "{}" : e[key]);
      } catch (_) {
        return;
      }
      if (!old || typeof old !== "object" || Array.isArray(old)) return;
      Object.keys(changes).forEach(function (k) {
        old[k] = changes[k];
      });
      e[key] = JSON.stringify(old);
    }
    merge("camera", {
      gold_max_duration: 60,
      max_duration: 60,
      ultra_wide: true,
      volume_button: true,
      flash_button: true,
      telephoto: true,
    });
    merge("camera_roll", {
      gold_max_duration: 60,
      video_max_duration: 60,
      max_duration: 60,
      trim_max_duration: 60,
      camera_roll_max_duration: 60,
    });
    merge("feature_gates", { video: "enabled", longer_video: "enabled" });
    merge("camera_filter_config", {
      allows_custom_filters: true,
      show_filter_button: true,
      sheet_enabled: true,
    });
    [
      "camera_roll_preview_enabled",
      "camera_roll_video_enabled",
      "camera_roll_video_upload_enabled",
      "internal_camera_roll_video_upload_enabled",
      "longer_camera_roll_videos_enabled",
      "video_sound_enabled",
      "microphone_enabled",
      "camera_microphone_enabled",
    ].forEach(function (k) {
      e[k] = "true";
    });
    e.history_ads_mode = "off";
    e.send_to_self_only_mode = "always_enabled";
    e.privacy_choices_setting = "true";
    // The section is replaced by name on subsequent runs, avoiding duplicates.
    var captions = [
      ["mot_ngay_moi", "Một ngày mới ☀️", "#FFF0C2", "#FFC978"],
      ["chut_binh_yen", "Một chút bình yên 🌿", "#D9F4DF", "#A8D5BA"],
      ["chao_buoi_sang", "Chào buổi sáng ☕", "#F8E7D4", "#D6A77A"],
      ["nghi_ngoi_nhe", "Nghỉ một lát nhé ☁️", "#DFEFFF", "#B5D3EA"],
      ["di_dau_day", "Hôm nay đi đâu? 🗺️", "#E5F3F1", "#9ED2C6"],
      ["khoanh_khac_nho", "Một khoảnh khắc nhỏ 📸", "#FCE6E9", "#EAB9C3"],
      ["nang_ghe_tham", "Nắng ghé thăm 🌤️", "#FFF4CC", "#F5D58B"],
      ["cuoi_len_nao", "Cười lên nào 😄", "#FFF5BB", "#F8D96C"],
      ["dang_nghi_gi", "Đang nghĩ gì thế? 💭", "#E8E3FF", "#B7A9E8"],
      ["nho_mot_nguoi", "Nhớ một người 💌", "#FFE0E7", "#F2B0C1"],
      ["gap_nhau_nhe", "Sớm gặp nhau nhé 🫶", "#F9E1EE", "#EAB8D3"],
      ["gui_ban_ne", "Gửi bạn nè 💛", "#FFF0B3", "#F4CE6A"],
      ["hom_nay_on", "Hôm nay ổn không? 🌷", "#FBE5EF", "#EAB8D1"],
      ["cam_on_nhe", "Cảm ơn vì ở đây 🌼", "#FFF0D1", "#EBC891"],
      ["mot_chut_dong_luc", "Bạn làm được mà ✨", "#EBE2FF", "#CCB4F2"],
      ["cham_mot_chut", "Chậm một chút thôi 🍃", "#DFF2E5", "#AED8B9"],
      ["do_an_toi", "Giờ ăng tới rùi 🍜", "#FFE8D4", "#F2BC91"],
      ["ca_phe_chua", "Cà phê chưa? ☕", "#F2E0CD", "#CDA581"],
      ["ve_nha_thoi", "Về nhà thôi 🏠", "#E7EDF9", "#B7C9E8"],
      ["troi_dep", "Trời hôm nay đẹp 🌈", "#E1F1FF", "#AED4F2"],
      ["da_hoan_thanh", "Xong một việc rồi ✅", "#DCF4E2", "#A5DAB1"],
      ["cho_toi_chut", "Chờ tôi một chút ⏳", "#FFF0D9", "#EBC597"],
      ["buoi_toi_yen", "Một buổi tối yên 🌙", "#E5E5F9", "#B7B8E0"],
      ["ngu_ngon", "Vọ iuuu ngụ ngong nhóe 💤", "#E4E9FA", "#AEBFE6"],
      ["ve_nha_mao", "Về nhà maoooo 😤", "#ED213A", "#93291E"],
      [
        "doi_tru_deadline",
        "đời cho gì nhận nấy, trừ deadline 📚",
        "#F0D1A4",
        "#D5D9EF",
      ],
      ["autumn", "Xin chào Mùa Thu 🍂", "#FFE0A0", "#F6A53A"],
      ["em_nho_anhh", "em nhớ anhh", "#FF6B81", "#FFB3C6", "🥺"],
      [
        "nho_anh_phien",
        "nhớ anh tới mức hơi phiền",
        "#F0B5CB",
        "#DCCAF0",
        "🥺",
      ],
      ["i_love_you", "i love you 💗", "#FF8FAB", "#FFE5EC"],
      ["yeu_cuc_dang", "yêu cục dàng 🎀", "#F2B5C8", "#F6E5D2"],
      ["yeu_emmm", "Yeu Emmm 💗", "#F2AFC6", "#E5CFF4"],
      ["yeu_anhhh", "Yeu Anhhh 💗", "#B8C9F2", "#E8CFF0"],
      ["baby_love", "Baby Love 💖", "#FFB6C1", "#FF1493"],
      ["muon_duoc_om", "Muốn được ôm 🤗", "#FF9A9E", "#FECFEF"],
      ["cho_hun_mieng", "cho hun miếng coi 😘", "#F3AFC7", "#F4C9BB"],
      ["me_anh_me_ngu", "mê anh hơn mê ngủ 💤", "#C4C8EF", "#EBCDE4"],
      ["be_be_can_do", "em bé cần được dỗ 🎀", "#FF8FAB", "#FFE5EC"],
      ["iu_thi_noi", "iu thì nói, đừng có ngại 🤭", "#FFD166", "#FFF3D0"],
      ["iu_hong_thi_bao", "iu hong thì bảo 🎀", "#FF6B6B", "#FFD1C9"],
      ["dang_ban_tuong_tu", "Đang bận tương tư 💭", "#1A2980", "#26D0CE"],
      ["mac_bay_tinh_yeu", "Mắc bẫy tình yêu 💘", "#EE9CA7", "#FFDDE1"],
      ["dating_time", "Dating Time! 💕", "#E91E63", "#F44336"],
      [
        "tuong_love_hoa_ra_lop",
        "Tưởng love hoá ra lốp ❤️‍🩹",
        "#C9184A",
        "#FFB3C6",
      ],
      ["feeling_cute", "Feeling Cute 🌷", "#F8BBD0", "#E91E63"],
      ["cutie_pie", "Cutie Pie 🌸", "#FFDEE9", "#FF9AA2"],
      ["hello_kitty", "Hello Kitty 🐱", "#FFD1DC", "#FFC0CB"],
      ["ngoan_xinh_iu", "ngoan xinh iu của ai đây 🌷", "#F3C1D4", "#E8CFF0"],
      ["xinh_dep_tuyet_voi", "Xinh đẹp tuyệt vời 💅", "#FC5C7D", "#6A82FB"],
      ["khi_chat", "không hoàn hảo nhưng có khí chất 😎", "#FFB36B", "#FFF0C2"],
      ["sieu_cap_ba_khi", "siêu cấp bá khí 🐉", "#EC407A", "#F44336"],
      ["bung_no", "Bùng nổ 💥", "#FF6B6B", "#FFD166"],
      ["ba_khi", "bá khí ngang ngược 😎", "#8EACCD", "#D7C7E6"],
      ["du_ba_khi_chua", "Đủ bá khí chưa? 👑", "#CBB4DE", "#F2E3F7"],
      ["oach_xa_lach", "oách xà lách 🥬", "#11998E", "#38EF7D"],
      ["cung_cung_di", "Cũng cứng đi 🚀", "#FF7043", "#FFCA70"],
      ["cung_fomo", "cũng fomo theo 👀", "#E6C8E7", "#EFD6D8"],
      ["ra_duong_ne_moi_anh", "Ra đường nể mỗi anh 🕶️", "#BCC5D6", "#EDE8F5"],
      ["nhin_la_biet_uy_tin", "Nhìn là biết uy tín 👌", "#2980B9", "#2C3E50"],
      ["che_manh", "Chê mạnh 👎", "#FF4E50", "#F9D423"],
      ["ghet_dua_kia_ghe", "ghét đứa kia ghê 😒", "#52647A", "#BBC9D8"],
      ["alone", "🌙 Alone 😭", "#C9CDE2", "#E3D2E4"],
      ["an_nho", "ăn nhó 🍜", "#F8D5A8", "#F3B9A9"],
      ["new_years_day", "Happy New Year! 💫", "#3B00EC", "#823FFF"],
      ["cuoi_vcl_m_oi", "Cười vcl m oi 😂", "#F7971E", "#FFEE58"],
      ["cuoi_xiu", "Cười xỉu 😎", "#FFEB3B", "#FF9800"],
      ["luon_vui_tuoi", "Luôn vui tươi 🤡", "#00F2FE", "#4FACFE"],
      ["nau_xoi", "Nấu xói 🙀", "#B8E04A", "#F5FFB8"],
      ["con_vien_la_lan", "côn viên lá làn 🍂", "#A8C3A0", "#DCE5D1"],
      ["gian_dang_iu_hong", "Gián đáng iu hong 🪳", "#A8E6CF", "#FFF1B6"],
      ["am_cha_hui", "ăm chã húi, bà chã hơm 🎀", "#F1C0D2", "#E7D1F2"],
      ["hong_drama", "Hóng drama 🍿", "#8A2387", "#F27121"],
      ["ke_chuyen_nghe_choi", "Kể chuyện nghe chơi 🍿", "#8A2387", "#E94057"],
      [
        "drama_ai_hong",
        "thân ai nấy lo, drama ai nấy hóng 🍿",
        "#F0C4A8",
        "#D8C6E5",
      ],
      ["check_var", "Check VAR liền 📺", "#11998E", "#38EF7D"],
      ["co_bien_co_bien", "Có biến có biến", "#FF512F", "#FFD200"],
      ["so_ho_la_bao", "sơ hở là báo 🚨", "#F5B8A9", "#E8BFCB"],
      ["bot_bao", "bớt báo giùm cái 🚨", "#7AA6C2", "#DCE8EF"],
      ["ai_so_thi_di_ve", "ai sợ thì đi về 🏃", "#B71C1C", "#FF5722"],
      ["chay_ngay_di", "Chạy ngay đi 🏃💨", "#D31027", "#EA384D"],
      [
        "len_chua_khong_biet_lay_ai",
        "lên chùa không biết lạy ai 🙏🥺",
        "#D7CCC8",
        "#F5F5F0",
      ],
      ["dam_nhau_khong", "đấm nhau không 🥊", "#E53935", "#FF7043"],
      ["hao_han", "Hảo hán 🗡️", "#292E49", "#E09F3E"],
      [
        "mong_ton_hoa_sen",
        "Mong tôn hoa sen thấy cảnh này 🪷",
        "#D8B4E2",
        "#F8BBD0",
      ],
      ["con_cai_nit", "còn cái nịt 🧶", "#D7CCC8", "#8D6E63"],
      ["minh_la_lop", "Mình là lốp 🛞", "#263238", "#455A64"],
      ["hay_ra_de_qua_a", "Hay ra dẻ quá à! 🥺", "#FFF59D", "#80DEEA"],
      ["mac_co_qua_hai_oi", "Mắc cỡ quá hai ơi 😭", "#FFB74D", "#F8BBD0"],
      ["than_chua_ma_don", "Thân chưa mà dỡn 😔", "#607D8B", "#37474F"],
      ["ai_muon", "ủa rồi ai mượn? 🤨", "#FF6B35", "#FFE0A3"],
      ["co_ra_dai_khong", "có ra dại không 😭", "#FF4D6D", "#FFD6A5"],
      [
        "he_dieu_hanh_la",
        "bạn mình nhưng hệ điều hành lạ 🤨",
        "#287271",
        "#B5E5D5",
      ],
      [
        "ai_cung_khac",
        "ai rồi cũng khác, riêng bạn thì lạ 🤡",
        "#343A40",
        "#AAB4BE",
      ],
      ["tuong_tuong", "tưởng gì, hóa ra tưởng tượng 🤡", "#3977D5", "#D0E4FF"],
      ["be_hong_sai", "bé hông có sai, tại đời sai 😌", "#F4A7C3", "#FFF0F3"],
      [
        "khong_vua_long",
        "sống sao cho vừa lòng thiên hạ? thôi khỏi 😌",
        "#D5A64B",
        "#FFF0BF",
      ],
      ["boc_trung_sit_rit", "Bóc trúng sít rịt 🎁", "#9C27B0", "#7B1FA2"],
      [
        "hen_lam_moi_xui_duoc_vay_a",
        "Hên lắm mới xui được vậy á 😅",
        "#00BCD4",
        "#0097A7",
      ],
      [
        "giam_suc_manh_con_tuong",
        "Giảm sức mạnh con tướng 🎮",
        "#4CAF50",
        "#00BCD4",
      ],
      ["phu_huynh_dung_xem", "Phụ huynh đừng xem 🙈", "#FF0844", "#FFB199"],
      ["khong_van_de_gi_luon", "Không vấn đề gì luôn 👌", "#087E8B", "#B8F2E6"],
      ["xin_vinh_biet_cu", "Xin vĩnh biệt cụ 🕯️", "#232526", "#414345"],
      ["et_o_et", "ét ô ét", "#F3C4C4", "#EED9B9"],
      ["nao_khong_treu_ban", "nào không trêu bạn", "#C9DCEB", "#DDE9D8"],
      ["than_chua_ma_gion", "thân chưa mà giỡn 🤨", "#D5D1C4", "#E9DDC9"],
      ["an_noi_xa_lo", "ăn nói xà lơ 🤡", "#E8C6C6", "#EBD8C7"],
      ["toi_cong_chuyen", "tới công chuyện nữa rồi 💀", "#F2B5A7", "#E9C2D5"],
      ["toang_that_roi", "Toang thật rồi 🐉", "#F44336", "#B71C1C"],
      ["toi_roi_toi_roi", "Tới rồi tới rồi ❗", "#F7253E", "#FFC857"],
      ["goi_xong_lun", "gòi xong lun á 😭", "#F3B6AF", "#EAC8D9"],
      ["xiu_ngang", "xĩu ngang xĩu dọc 💀", "#C0B7E5", "#EACDE2"],
      ["guc_nga", "Gục ngã 📉", "#3A1C71", "#D76D77"],
      ["bat_luc", "Bất lực 🏳️", "#2C3E50", "#3498DB"],
      ["rot_nuoc_mat", "Rớt nước mắt 😭", "#1CB5E0", "#000046"],
      ["tien_dinh", "Tiền đình 🌪️", "#FF9A8B", "#FF6A88"],
      ["nao_bao_tri", "não đang bảo trì 🧠", "#B8E0D2", "#C9D9F0"],
      [
        "song_gio_phu_doi_trai",
        "Sóng gió phủ đời trai 🌪️",
        "#3A1C71",
        "#D76D77",
      ],
      ["deadline_ruot", "Deadline dí tụt quần 🔥", "#ED213A", "#93291E"],
      ["ca_o_ran_doc", "Cả ổ rắn độc 🐍", "#0F2027", "#66BB6A"],
      [
        "cu_tu_tu_khoai_se_nhu",
        "Cứ từ từ khoai sẽ nhừ 🥔",
        "#56AB2F",
        "#A8E063",
      ],
      ["chay_vi", "cháy ví 💸", "#F2C4B6", "#E9D2B8"],
      ["tien_dau_ma_tieu", "Tiền đâu mà tiêu 💸", "#11998E", "#38EF7D"],
      ["ngay_moi_vui_ve", "Ngày mới vui vẻ ☀️", "#FFB703", "#FFF0A8"],
      ["coffee_time", "Coffee Time! ☕", "#4E342E", "#8D6E63"],
      ["matcha_latte", "Matcha Latte 🍵 🍃", "#C8E6C9", "#81C784"],
      ["mixue_time", "Mixue Time! 🍦", "#FFF9C4", "#F8BBD0"],
      [
        "tien_mua_tra_sua",
        "tiền không mua được tất cả, nhưng mua được trà sữa 🧋",
        "#D7B77D",
        "#F5E7CC",
      ],
      ["an_com_chua", "Ăn cơm chưa? 🍽️", "#FF9800", "#F57C00"],
      ["dinner_time", "Dinner Time! 🍽️", "#FFCCBC", "#FF8A80"],
      ["di_choi_khong", "Đi chơi không? ✈️", "#E91E63", "#C2185B"],
      ["tuyet_voi_uong_nao", "tuyệt vời, uống nào! 🥂", "#F0C58E", "#EBC6B8"],
      ["shopping_time", "Shopping Time! 🛍️", "#B3E5FC", "#FFFFFF"],
      ["cinema_time", "Cinema Time! 🎬", "#1A237E", "#455A64"],
      ["tuyet_doi_dien_anh", "Tuyệt đối điện ảnh 📷", "#455A64", "#263238"],
      ["qua_la_dien_anh", "Quá là điện ảnh 📷", "#26A69A", "#00897B"],
      ["locket_time", "Locket Time! 📷", "#ECEFF1", "#B3E5FC"],
      ["chilling_time", "Chilling Time! 🌴", "#E1BEE7", "#F8BBD0"],
      ["graduation_day", "Happy Graduation Day! 🎓", "#1A237E", "#283593"],
      ["bien_oiiii", "Biển ơiiii 🌊", "#56CFE1", "#B8F3FF"],
      ["hoi_chieu_troi_mua", "Hồi chiều trời mưa... 🌧️", "#546E7A", "#263238"],
      ["rainy_day", "Rainy Day ☕🌧️", "#6D4C41", "#BCAAA4"],
      ["cam_lanh", "Cảm lạnh 🤧", "#2193B0", "#6DD5ED"],
      [
        "bau_troi_da_ly_huong",
        "nhìn bầu trời màu dạ lý hương",
        "#B8A1D9",
        "#A9B8E8",
      ],
      ["night_vibes", "Night Vibes 🌌 🪐", "#B993D6", "#C9B1FF"],
      ["2am_thoughts", "2:00 AM Thoughts 🌙", "#0F2027", "#2C5364"],
      ["sweet_dream", "Sweet Dream 🧊 ☁️", "#A1C4FD", "#E0F7FA"],
      ["nhiem_vu_di_ngu", "nhiệm vụ hệ thống: đi ngủ 🫡", "#172554", "#91A7FF"],
      ["da_den_luc_tat_nguon", "đã đến lúc tắt nguồn 😴", "#283593", "#B3C5FF"],
      [
        "nao_nghi_lam_tay_van_online",
        "não nghỉ làm, tay vẫn online 🤡",
        "#FF6B35",
        "#FFE0A3",
      ],
      [
        "pin_nguoi_dung_con_1",
        "cảnh báo: pin người dùng còn 1% 🚨",
        "#D62828",
        "#FCBF49",
      ],
      [
        "nhiem_vu_hom_nay_nam_im",
        "nhiệm vụ hôm nay: nằm im 🛌",
        "#168AAD",
        "#D9ED92",
      ],
      ["mai_tinh_nay_ngu", "mai tính, nay ngủ 💀", "#343A40", "#ADB5BD"],
      ["offline_de_hoi_sinh", "offline để hồi sinh 💤", "#006D77", "#EDF6F9"],
      ["xin_moii", "xin mờii 👋", "#F6B6C8", "#D8C8F4"],
      ["helo_ca_nha_iu", "hé lô cả nhà iu 💗", "#F4C3D5", "#D8D1F2"],
      [
        "ca_nha_thay_em_cute",
        "cả nhà thấy em cute hong ạ",
        "#F4C5D9",
        "#F7DFCA",
      ],
      ["com_nuoc_chua", "cơm nước gì chưa người đẹp 🍚", "#F5C9B8", "#F4E1C5"],
      ["chup_moi_cho_an", "chụp mới cho ăn", "#F5C5A9", "#F8E2BE"],
      ["nham_nham", "nhăm nhăm", "#F8D7A7", "#F2BDA5"],
      ["lanh_thay_me", "lạnh thấy mẹ 🥶", "#BEDCEB", "#D9E9EF"],
    ];
    try {
      var sections =
        e.overlay_items === undefined ? [] : JSON.parse(e.overlay_items);
      if (Array.isArray(sections)) {
        sections = sections.filter(function (section) {
          return !section || section.section !== "✨ Tag của tôi";
        });
        sections.push({
          section: "✨ Tag của tôi",
          items: captions.map(function (item) {
            var caption = {
              type: "static_content",
              text: item[1],
              localized_text: { en: item[1], vn: item[1] },
              max_lines: 1,
              text_color: "#242424",
              background: { colors: [item[2], item[3]] },
            };
            if (item[4]) {
              var sf = /^sf:(.+)\|(.+)$/.exec(item[4]);
              if (sf) {
                caption.icon = { type: "sf_symbol", data: sf[1], color: sf[2] };
              } else if (/^https?:\/\//i.test(item[4])) {
                caption.icon = { type: "image", data: item[4], source: "url" };
              } else {
                caption.icon = { type: "emoji", data: item[4] };
              }
            }
            return {
              overlay_id: "caption:my_" + item[0],
              source: "remote",
              caption: caption,
            };
          }),
        });
        e.overlay_items = JSON.stringify(sections);
        e.captions_enabled = "true";
        e.overlay_navigator_enabled = "true";
      }
    } catch (_) {
      /* Leave unexpected server data unchanged. */
    }
    console.log("[locket-config] applied: camera=60 self-only=enabled");
    return $done({ body: JSON.stringify(data) });
  } catch (_) {
    console.log("[locket-config] skipped: invalid JSON");
    return $done({ body: body });
  }
})();
