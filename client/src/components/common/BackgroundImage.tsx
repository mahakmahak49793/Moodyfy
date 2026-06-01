const BackgroundImage = () => (
  <div
    className="fixed inset-0 -z-10"
    style={{
      backgroundImage: `
        linear-gradient(
          to bottom,
          rgba(2, 28, 38, 0.55) 0%,
          rgba(3, 60, 80, 0.35) 30%,
          rgba(240, 249, 255, 0.82) 65%,
          rgba(240, 253, 250, 0.92) 100%
        ),
        url('https://img.freepik.com/premium-photo/calm-ocean-moody-sky_1179475-44119.jpg?semt=ais_hybrid&w=740&q=80')
      `,
      backgroundSize: "cover",
      backgroundPosition: "center top",
      backgroundAttachment: "fixed",
    }}
  />
);

export default BackgroundImage;