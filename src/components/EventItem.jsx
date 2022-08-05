function EventItem({ id, pot, title, voteSize, buckets }) {
  return (
    <div >
      {JSON.stringify({ id, pot, title, voteSize, buckets }, null, 2)}
    </div>
  );
}

export default EventItem;
