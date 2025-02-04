"use client";

import * as React from "react";
import ContentLayoutClient from "@/components/layout/ContentLayoutClient";
import CloudScapeLink from "@/components/link/CloudScapeLink";
import { Header } from "@cloudscape-design/components";
import Input from "@cloudscape-design/components/input";
import Alert from "@cloudscape-design/components/alert";
import Button from "@cloudscape-design/components/button";
import ContentLayoutServer from "@/components/layout/ContentLayoutServer";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const [value, setValue] = React.useState("");
  const [showAlert, setShowAlert] = React.useState(false);
  const router = useRouter();

  const handleButtonClick = () => {
    if (!value.trim()) {
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }
    else {
      router.push('/search-result')
    }

  };

  React.useEffect(() => {
    console.log("showAlert 상태:", showAlert);
  }, [showAlert]);

  return (
    <>
      <ContentLayoutClient
        className="flex justify-center items-center h-[80vh] mt-[-5vh]"
      // header={
      //   <Header variant="h1" info={<CloudScapeLink variant="info">Info</CloudScapeLink>}>
      //     Home
      //   </Header>
      // }
      >
        <div className="flex flex-col items-center">
          <Image
            className="mb-4"
            src="/LOGO2.png"
            alt="logo"
            width={300}
            height={300}
          />
          <div className="flex">
            <Input
              className="min-w-[300px] mr-2"
              onChange={({ detail }) => setValue(detail.value)}
              value={value}
              placeholder="검색하고 싶은 주류를 입력하세요."
              onKeyDown={(e) => {
                if (e.detail.key === "Enter") {
                  handleButtonClick();
                }
              }}
            />

            <Button
              variant="primary"
              onClick={handleButtonClick}
              iconName="search"
            >
            </Button>

          </div>

        </div>
        {showAlert && (
          <div className="alert-container">
            <Alert header="검색어 미입력"></Alert>
          </div>
        )}

      </ContentLayoutClient>
    </>
  );
}
