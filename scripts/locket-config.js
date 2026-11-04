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
      ["do_an_toi", "Đến giờ ăn rồi 🍜", "#FFE8D4", "#F2BC91"],
      ["ca_phe_chua", "Cà phê chưa? ☕", "#F2E0CD", "#CDA581"],
      ["ve_nha_thoi", "Về nhà thôi 🏠", "#E7EDF9", "#B7C9E8"],
      ["troi_dep", "Trời hôm nay đẹp 🌈", "#E1F1FF", "#AED4F2"],
      ["da_hoan_thanh", "Xong một việc rồi ✅", "#DCF4E2", "#A5DAB1"],
      ["cho_toi_chut", "Chờ tôi một chút ⏳", "#FFF0D9", "#EBC597"],
      ["buoi_toi_yen", "Một buổi tối yên 🌙", "#E5E5F9", "#B7B8E0"],
      ["ngu_ngon", "Vọ iuuu ngụ ngong nhóe 💤", "#E4E9FA", "#AEBFE6"],
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
            return {
              overlay_id: "caption:my_" + item[0],
              source: "remote",
              caption: {
                type: "static_content",
                text: item[1],
                localized_text: { en: item[1], vn: item[1] },
                max_lines: 1,
                text_color: "#242424",
                background: { colors: [item[2], item[3]] },
              },
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
