function EventItem({ id, pot, title, voteSize, buckets }) {
  return (
    <div className="">
      {JSON.stringify({ id, pot, title, voteSize, buckets }, null, 2)}
    </div>
  );
}

export default EventItem;
