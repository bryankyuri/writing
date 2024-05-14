"use client";
import { useState } from "react";
import Image from "next/image";
import { PanoViewer, PROJECTION_TYPE } from "@egjs/react-view360";

export default function PanoBanner() {
  const [isShowPano, setIsShowPano] = useState<boolean>(false);
  return (
    <div className="w-[203px] h-[135px] relative ">
      {/* <PanoViewer
        id="viewer"
        image={`https://naver.github.io/egjs-view360/examples/panoviewer/etc/img/bookcube1.jpg`}
        useZoom={false}
        projectionType={PROJECTION_TYPE.CUBEMAP}
        cubemapConfig={{ tileConfig: { flipHorizontal: true, rotation: 0 } }}
        canvasClass="some-other-class"
      /> */}
      {isShowPano ? (
        <div className="w-[594px] h-[395px] absolute bottom-0 left-0 bg-blue-50 rounded-[8px]">
          <iframe
            width="600"
            height="400"
            allowFullScreen
            style={{ borderStyle: "none" }}
            src="https://cdn.pannellum.org/2.5/pannellum.htm#panorama=https://i.imgur.com/lHR3tuG.jpg&amp;preview=https://pannellum.org/images/cerro-toco-0.jpg&amp;autoLoad=true"
          ></iframe>
        </div>
      ) : (
        <button
          className="w-[203px] h-[135px] rounded-[8px] flex items-end"
          style={{
            backgroundImage: "url(/bghomepano.png)",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
          onClick={() => setIsShowPano(true)}
        >
          <Image
            src="/drag-move.svg"
            width={32}
            height={32}
            alt="✥"
            className="m-2"
          />
        </button>
      )}
    </div>
  );
}
