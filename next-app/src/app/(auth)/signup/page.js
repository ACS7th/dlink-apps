"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { Button, Container, Form, FormField, Header, Input, SpaceBetween } from "@cloudscape-design/components";

export default function SignupPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [nameError, setNameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [error, setError] = useState("");
    const emailParam = useSearchParams().get("email");
    const router = useRouter();
    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    useEffect(() => {
        if (emailParam) {
            setEmail(emailParam);
        }
    }, []);

    const handleNameChange = (e) => {
        setName(e.detail.value);
        setNameError("");
    };

    const handleNameBlur = () => {
        if (!name) {
            setNameError("이름을 입력해주세요.");
        }
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
        } else if (password.length < 6) {
            setPasswordError("비밀번호는 최소 6자 이상이어야 합니다.");
        }
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.detail.value);
        setConfirmPasswordError("");
    };

    const handleConfirmPasswordBlur = () => {
        if (confirmPassword !== password) {
            setConfirmPasswordError("비밀번호가 일치하지 않습니다.");
        }
    };

    const handleSubmit = async () => {
        let isValid = true;

        if (!name) {
            setNameError("이름을 입력해주세요.");
            isValid = false;
        }

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
        } else if (password.length < 6) {
            setPasswordError("비밀번호는 최소 6자 이상이어야 합니다.");
            isValid = false;
        }

        if (confirmPassword !== password) {
            setConfirmPasswordError("비밀번호가 일치하지 않습니다.");
            isValid = false;
        }

        if (!isValid) {
            setError("입력한 정보를 다시 확인해주세요.");
            return;
        }

        try {
            let response;
            if (emailParam) {
                response = await axios.put("/api/v1/auth/update", {
                    name,
                    email: emailParam,
                    password,
                })
            } else {
                response = await axios.post("/api/v1/auth/signup", {
                    name,
                    email,
                    password,
                });
            }

            if (response.status === 200) {
                alert("회원가입 완료! 로그인 페이지로 이동합니다.");
                router.push("/login");
                return;
            }

            setError("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.");
        } catch (error) {
            setError("회원가입 중 서버 오류가 발생했습니다. 다시 시도해주세요.");
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <Container className="max-w-lg w-full bg-white p-6 shadow-lg rounded-lg">
                <Form
                    errorText={error}
                    actions={
                        <SpaceBetween direction="horizontal" size="xs">
                            <Button variant="link" onClick={() => router.push("/")}>
                                취소
                            </Button>
                            <Button variant="primary" onClick={handleSubmit}>
                                회원가입
                            </Button>
                        </SpaceBetween>
                    }
                    header={
                        <Header variant="h1" description="가입을 위해 아래 정보를 입력하세요.">
                            회원가입
                        </Header>
                    }
                >
                    <Container className="p-4">
                        <SpaceBetween direction="vertical" size="l">
                            <FormField label="이름" errorText={nameError}>
                                <Input
                                    type="text"
                                    value={name}
                                    onChange={handleNameChange}
                                    onBlur={handleNameBlur}
                                />
                            </FormField>

                            <FormField label="이메일" errorText={emailError}>
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={handleEmailChange}
                                    onBlur={handleEmailBlur}
                                    inputMode="email"
                                    disabled={emailParam ? true : false}
                                />
                            </FormField>

                            <FormField label="비밀번호" errorText={passwordError}>
                                <Input
                                    type="password"
                                    value={password}
                                    onChange={handlePasswordChange}
                                    onBlur={handlePasswordBlur}
                                    inputMode="password"
                                />
                            </FormField>

                            <FormField label="비밀번호 확인" errorText={confirmPasswordError}>
                                <Input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={handleConfirmPasswordChange}
                                    onBlur={handleConfirmPasswordBlur}
                                    inputMode="password"
                                />
                            </FormField>
                        </SpaceBetween>
                    </Container>
                </Form>
            </Container>
        </div>
    );
}
