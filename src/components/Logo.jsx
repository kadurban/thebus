function Logo({ color = 'rgb(51 65 85)' }) {
  return (
    <div
      className="uppercase leading-6 text-2xl"
      style={{
        transform: 'skew(345deg)',
        maxWidth: '3.2rem'
      }}
    >
      <div
        className="absolute h-0.5 w-14"
        style={{
          top: '.45rem',
          left: '100%',
          backgroundColor: color
        }}
      />
      <div
        className="absolute bg-white h-0.5 w-12"
        style={{
          top: '.95rem',
          left: '100%',
          backgroundColor: color
        }}
      />
      <div
        className="absolute bg-white h-0.5 w-10"
        style={{
          top: '1.45rem',
          left: '100%',
          backgroundColor: color
        }}
      />
      <div
        className="absolute bg-white h-0.5 w-8"
        style={{
          top: '1.95rem',
          left: '100%',
          backgroundColor: color
        }}
      />
      <div
        className="absolute bg-white h-0.5 w-6"
        style={{
          top: '2.45rem',
          left: '100%',
          backgroundColor: color
        }}
      />
      <div className="mr-2" style={{
        color
      }}>
        The
        <br/>
        Bus
      </div>
    </div>
  );
}

export default Logo;
