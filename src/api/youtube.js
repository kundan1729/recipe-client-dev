const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/search';

export async function searchRecipeVideos(recipeTitle) {
  if (!YOUTUBE_API_KEY) {
    throw new Error('YOUTUBE_API_KEY is not configured. Please add it to your .env file.');
  }

  const query = `${recipeTitle} recipe cooking tutorial`;
  const url = `${YOUTUBE_API_URL}?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=3&key=${YOUTUBE_API_KEY}`;

  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to fetch videos');
  }

  const data = await response.json();

  return data.items.map((item) => ({
    id: item.id.videoId,
    title: item.snippet.title,
    thumbnail: item.snippet.thumbnails.high.url,
    channelTitle: item.snippet.channelTitle,
    url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
  }));
}
