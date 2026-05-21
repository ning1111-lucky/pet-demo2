export const getTagsForTrack = async (artist: string, track: string) => {
    const API_KEY = import.meta.env.VITE_LASTFM_API_KEY;
    if (!API_KEY) return [];

    try {
        const url = `https://ws.audioscrobbler.com/2.0/?method=track.gettoptags&api_key=${API_KEY}&artist=${encodeURIComponent(artist)}&track=${encodeURIComponent(track)}&format=json&autocorrect=1`;
        const response = await fetch(url);
        if (!response.ok) return [];
        const data = await response.json();
        if (data.toptags && data.toptags.tag) {
            let tags = data.toptags.tag;
            if (!Array.isArray(tags)) tags = [tags];
            return tags.slice(0, 5).map((t: any) => t.name.toLowerCase());
        }
    } catch(e) {
        console.error("Last.fm error", e);
    }
    return [];
}

export const analyzeTags = (allTags: string[]) => {
    const counts: Record<string, number> = {};
    for (const tag of allTags) {
        counts[tag] = (counts[tag] || 0) + 1;
    }

    const sortedTags = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const topTags = sortedTags.slice(0, 5).map(t => t[0]);

    // Apply mapping rules
    let style = "Basic";
    let mood = "開心";
    let genre = "流行音樂";
    let tempo = "中";

    const tagStr = topTags.join(" ");

    if (tagStr.match(/pop|k-pop|kpop|dance-pop|idol/)) {
        style = "舞台感、亮色、閃亮配件";
        genre = "K-pop";
        mood = "熱血";
        tempo = "快";
    } else if (tagStr.match(/rock|punk|metal|搖滾/)) {
        style = "深色、尖角、金屬感";
        genre = "搖滾";
        mood = "冷酷";
        tempo = "快";
    } else if (tagStr.match(/hip-hop|hip hop|rap|嘻哈/)) {
        style = "街頭感、帽子、項鍊";
        genre = "嘻哈";
        mood = "冷酷";
        tempo = "中";
    } else if (tagStr.match(/electronic|dance|techno|edm/)) {
        style = "像素霓虹、光效、未來感";
        genre = "電子音樂";
        mood = "夢幻";
        tempo = "快";
    } else if (tagStr.match(/indie|alternative|獨立/)) {
        style = "拼貼、手作感、自然色";
        genre = "獨立音樂";
        mood = "慵懶";
        tempo = "慢";
    } else if (tagStr.match(/classical|piano|古典/)) {
        style = "優雅、簡約、柔和線條";
        genre = "古典音樂";
        mood = "憂鬱";
        tempo = "慢";
    } else if (tagStr.match(/lo-fi|lofi|chill/)) {
        style = "柔和、寬鬆、毛茸茸";
        genre = "Lo-fi";
        mood = "慵懶";
        tempo = "慢";
    }

    return { topTags, style, genre, mood, tempo };
}
