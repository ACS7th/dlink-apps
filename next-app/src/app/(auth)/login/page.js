"use client";

import { Button, ButtonGroup, ColumnLayout, Container, Form, FormField, Header, Input, SpaceBetween, StatusIndicator } from "@cloudscape-design/components";
import { useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation";
import axios from "axios";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();
    const { data: session, status } = useSession();
    const user = session?.user;

    useEffect(() => {
        if (user) {
            router.push("/");
        }
    }, [user, router]);

    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleEmailChange = (e) => {
        setEmail(e.detail.value);
        setEmailError("");
    };

    const handleEmailBlur = () => {
        if (!email) {
            setEmailError("이메일을 입력해주세요.");
        } else if (!isValidEmail(email)) {
            setEmailError("올바른 이메일 형식을 입력해주세요.");
        }
    };

    const handlePasswordChange = (e) => {
        setPassword(e.detail.value);
        setPasswordError("");
    };

    const handlePasswordBlur = () => {
        if (!password) {
            setPasswordError("비밀번호를 입력해주세요.");
        }
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
                email: email,
                password: password,
                redirect: false, // 페이지 이동을 직접 처리하기 위해 false 설정
            });

            if (result.ok) {
                router.push("/");
                return;
            }

            if (result.error.includes("회원가입이 필요합니다.")) {
                alert(result.error);
                return;
            }

            setError(result.error)
        } catch (error) {
            console.error("로그인 오류:", error);
            setError("로그인 중 문제가 발생했습니다. 다시 시도해주세요.");
        }
    };


    const handleKeyDown = (e) => {
        if (e.detail.key === 'Enter') {
            e.preventDefault();
            handleSubmit();
        }
    };

    const handleBtnGrpClick = ({ detail }) => {
        if (detail.id === "google") {
            signIn("google")
        }
        if (detail.id === "naver") {
            signIn("naver")
        }
        if (detail.id === "kakao") {
            signIn("kakao")
        }
    }

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <Container className="max-w-lg w-full bg-white p-6 shadow-lg rounded-lg">
                <Form
                    errorText={error}
                    actions={
                        <SpaceBetween direction="horizontal" size="xs">
                            <Button
                                formAction="none"
                                variant="link"
                                onClick={() => router.push("/")}
                            >
                                취소
                            </Button>
                            <Button
                                variant="primary"
                                onClick={handleSubmit}
                                formAction="none"
                            >
                                로그인
                            </Button>
                        </SpaceBetween>
                    }
                    header={
                        <Header
                            variant="h1"
                            description="이메일을 사용하여 로그인해주세요"
                        >
                            로그인
                        </Header>
                    }
                >
                    <Container className="p-4">
                        <SpaceBetween direction="vertical" size="l">
                            <FormField
                                label="이메일"
                                errorText={emailError}
                            >
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={handleEmailChange}
                                    onBlur={handleEmailBlur}
                                    onKeyDown={handleKeyDown}
                                    inputMode="email"
                                />
                            </FormField>

                            <FormField
                                label="비밀번호"
                                errorText={passwordError}
                            >
                                <Input
                                    type="password"
                                    value={password}
                                    onChange={handlePasswordChange}
                                    onBlur={handlePasswordBlur}
                                    onKeyDown={handleKeyDown}
                                    inputMode="password"
                                />
                            </FormField>
                        </SpaceBetween>
                    </Container>
                </Form>

                <Container
                    className="mt-4"
                >
                    <div className="text-center">SNS 계정으로 간편 회원가입/로그인</div>
                    <ButtonGroup
                        className="justify-evenly mt-4 login-btn-grp"
                        text="sdfsdf"
                        onItemClick={handleBtnGrpClick}
                        items={[
                            {
                                type: "icon-button",
                                id: "google",
                                iconUrl: "/google.svg",
                                text: "Google",
                            },
                            {
                                type: "icon-button",
                                id: "naver",
                                iconUrl: "/naver.svg",
                                text: "Naver",
                            },
                            {
                                type: "icon-button",
                                id: "kakao",
                                iconUrl: "/kakao.svg",
                                text: "Kakao",
                            }
                        ]}
                        variant="icon"
                    />
                </Container>
            </Container>
        </div>
    );
}