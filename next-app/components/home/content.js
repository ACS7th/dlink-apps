import { Input, Button, Link } from "@heroui/react";
import Image from "next/image";

export default function Content() {
    return (
        <div className="flex flex-col justify-center items-center h-[calc(100vh-120px)]">
            <Image
                src="/LOGO2.png"
                alt="logo"
                width={300}
                height={300}
            />

            <div className="flex w-full max-w-md">
                <Input
                    className="flex-1 mr-2"
                    placeholder="검색하고 싶은 주류를 입력하세요."
                />
                <Button color="primary" className="bg-red-900">
                    검색
                </Button>
            </div>
        </div>
    );
}
