import { ImageResponse } from "next/og";

export const size = {
  width: 192,
  height: 192,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#F7F1E6",
          borderRadius: "44px",
          border: "4px solid #E8DCC8",
        }}
      >
        <div
          style={{
            width: "140px",
            height: "140px",
            borderRadius: "70px",
            backgroundColor: "#FAF2E9",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "2px solid #C47737",
          }}
        >
          <span
            style={{
              fontSize: "76px",
              color: "#C47737",
              fontWeight: "bold",
              marginTop: "-8px",
            }}
          >
            ॐ
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

