import { describe, expect, test } from "vitest";
import { reqMusicSource } from "../../tools/req";

test("test-reqMusicSource", async () => {
    let id = 34274470;

    let expect_mso = {
        name: "夏天的风 (Live)",
        artists: "刘瑞琦",
        pirUrl: "https://p2.music.126.net/kOjwydrPmmB4j4DrvmAflw==/7875801790952799.jpg",
        dt: "",
        url: "",
    };
    let actual_mso = await reqMusicSource(id);

    expect(actual_mso.name).eq(expect_mso.name);
    expect(actual_mso.artists).eq(expect_mso.artists);
    expect(actual_mso.pirUrl).eq(expect_mso.pirUrl);
});