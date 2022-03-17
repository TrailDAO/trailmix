interface EmojiMarkerProps {
  lat: number,
  lng: number,
  emoji: string,
};
  
function EmojiMarker({lat, lng, emoji}: EmojiMarkerProps) {
  console.log("Latitude %s, Longitude %s", lat, lng);
  return <p>{emoji}</p>
}

export default EmojiMarker;