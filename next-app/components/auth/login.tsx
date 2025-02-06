"use client";

import { Alert, Button, Image, Input } from "@heroui/react";
import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();
    const { data: session } = useSession();

    useEffect(() => {
        console.log(session)
    }, []);


    const isValidEmail = (email: string) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        setEmailError("");
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        setPasswordError("");
    };

    const handleSubmit = async () => {
        let isValid = true;

        if (!email) {
            setEmailError("이메일을 입력해주세요.");
            isValid = false;
        } else if (!isValidEmail(email)) {
            setEmailError("올바른 이메일 형식을 입력해주세요.");
            isValid = false;
        }

        if (!password) {
            setPasswordError("비밀번호를 입력해주세요.");
            isValid = false;
        }

        if (!isValid) {
            setError("입력한 정보를 다시 확인해주세요.");
            return;
        }

        setError("");

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.ok) {
                router.push("/");
                return;
            }

            setError(result?.error || "로그인 실패");
        } catch (error) {
            console.error("로그인 오류:", error);
            setError("로그인 중 문제가 발생했습니다. 다시 시도해주세요.");
        }
    };

    return (
        <div className="flex flex-col w-1/2">
            <h2 className="text-2xl font-bold text-center mb-6">로그인</h2>

            <div className="flex flex-col gap-4">
                {/* 이메일 입력 */}
                <Input
                    variant="bordered"
                    label="이메일"
                    type="email"
                    value={email}
                    isInvalid={!!emailError}
                    errorMessage={emailError}
                    onChange={handleEmailChange}
                />

                {/* 비밀번호 입력 */}
                <Input
                    variant="bordered"
                    label="비밀번호"
                    type="password"
                    value={password}
                    isInvalid={!!passwordError}
                    errorMessage={passwordError}
                    onChange={handlePasswordChange}
                />

                {error && <Alert color="danger">{error}</Alert>}
            </div>

            <div className="flex justify-center mt-6">
                <Button onPress={handleSubmit}>로그인</Button>
            </div>

            {/* 소셜 로그인 */}
            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                    SNS 계정으로 간편 로그인
                </p>
                <div className="flex justify-center gap-4 mt-4">
                    <Button isIconOnly variant="light" onPress={() => signIn("google")}>
                        <Image src="/google.svg" alt="Google" className="p-1" />
                    </Button>
                    <Button isIconOnly variant="light" onPress={() => signIn("naver")}>
                        <Image src="/naver.svg" alt="Naver" className="p-1" />
                    </Button>
                    <Button isIconOnly variant="light" onPress={() => signIn("kakao")}>
                        <Image src="/kakao.svg" alt="Kakao" className="p-1" />
                    </Button>
                </div>
            </div>
            <div className="text-sm text-center text-gray-600 mt-4">
                계정이 없으신가요?{" "}
                <Link href="/register" className="text-primary-500 font-bold">
                    회원가입
                </Link>
            </div>
        </div>
    );
}
