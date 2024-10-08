#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod invoke;
mod models;

extern crate dotenv;

use std::env;

use tauri::{
    menu::{MenuBuilder, MenuItemBuilder},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    Emitter, Listener, Manager,
};

use crate::invoke::*;

#[derive(Clone, serde::Serialize)]
struct Payload {
    message: String,
}

pub struct Store {
    pub netease_server: String,
    pub api_server: String,
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_dialog::init())
        .setup(move |app| {
            // listen to the `event-name`.
            let _id = app.listen_any("event-name", |event| {
                println!("got  event-name with payload {:?}", event.payload());
            });
            let _ = app.listen_any("music-name", move |event| {
                let _new_nappame = event.payload();
            });
            // emit the `event-name` event to all webview windows on the frontend.
            app.emit(
                "Sevet-name",
                Payload {
                    message: "Tauri is awesome!".into(),
                },
            )
            .unwrap();
            Ok(())
        })
        .setup(|app| {
            let quit = MenuItemBuilder::with_id("quit", "退出").build(app)?;
            let show_or_hide = MenuItemBuilder::with_id("show_or_hide", "显示/隐藏").build(app)?;
            let previous = MenuItemBuilder::with_id("previous", "上一首").build(app)?;
            let next = MenuItemBuilder::with_id("next", "下一首").build(app)?;
            let menu = MenuBuilder::new(app)
                .items(&[&quit, &show_or_hide, &previous, &next])
                .build()?;
            let _tray = TrayIconBuilder::new()
                .menu(&menu)
                .on_menu_event(|app, event| match event.id().as_ref() {
                    "quit" => {
                        println!("quit clicked");
                        std::process::exit(0);
                    }
                    "show_or_hide" => {
                        if let Some(window) = app.get_webview_window("main") {
                            if window.is_visible().unwrap() {
                                window.hide().unwrap();
                            } else {
                                window.show().unwrap();
                            }
                        }
                    }
                    "previous" => {
                        println!("上一首");
                        app.emit("event-previous", "previous music").unwrap();
                    }
                    "next" => {
                        println!("下一首");
                        app.emit("event-next", "next music").unwrap();
                    }
                    _ => (),
                })
                .on_tray_icon_event(|tray, event| {
                    if let TrayIconEvent::Click {
                        button: MouseButton::Left,
                        button_state: MouseButtonState::Up,
                        ..
                    } = event
                    {
                        let app = tray.app_handle();
                        if let Some(webview_window) = app.get_webview_window("main") {
                            let _ = webview_window.show();
                            let _ = webview_window.set_focus();
                        }
                    }
                })
                .build(app)?;

            Ok(())
        })
        .on_window_event(|window, event| match event {
            tauri::WindowEvent::CloseRequested { api, .. } => {
                println!("window CloseRequested");
                window.hide().unwrap();
                api.prevent_close();
            }
            _ => {}
        })
        .invoke_handler(tauri::generate_handler![
            get_music_detail,
            get_music_url,
            check_server,
            check,
            login,
            register,
            get_playlist_all_music,
            get_playlist_detail,
            search,
            get_album_detail,
            get_artist_common_detail,
            get_artist_all_songs,
            get_artist_all_albums,
            get_all_playlist_header,
            create_playlist,
            delete_playlist,
            update_song_to_playlist,
            get_allsong_playlist,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
