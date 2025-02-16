"use client";

import { Button, Input, Alert } from "@heroui/react";
import axios from "axios";
import { Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";

export const SignUp = () => {
    const router = useRouter();
    const [error, setError] = useState(null);
    const [isRegLoading, setIsRegLoading] = useState(false);

    const initialValues = {
        nickname: "",
        email: "",
        password: "",
        confirmPassword: "",
    };

    const validateEmail = (email) => /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/.test(email);
    const validatePassword = (password) => password.length >= 6 && /\d/.test(password);

    const handleRegister = useCallback(async (values, { setErrors }) => {
        setError(null);
        let errors = {};

        if (!values.nickname) errors.nickname = "닉네임을 입력해주세요.";
        if (!values.email) errors.email = "이메일을 입력해주세요.";
        else if (!validateEmail(values.email)) errors.email = "올바른 이메일 형식을 입력해주세요.";
        if (!values.password) errors.password = "비밀번호를 입력해주세요.";
        else if (!validatePassword(values.password)) errors.password = "비밀번호는 최소 6자 이상, 숫자를 포함해야 합니다.";
        if (values.password !== values.confirmPassword) errors.confirmPassword = "비밀번호가 일치하지 않습니다.";

        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            return;
        }

        setIsRegLoading(true);
        try {
            const response = await axios.post("/api/v1/auth/signup", {
                name: values.nickname,
                email: values.email,
                password: values.password,
            });
            if (response.status === 201) {
                alert("회원가입이 완료되었습니다. 로그인해주세요.");
                router.replace("/login");
            } else {
                throw new Error(response.data.message || "회원가입 실패");
            }
        } catch (err) {
            setError(err.response?.data?.message || "회원가입 중 오류 발생");
        } finally {
            setIsRegLoading(false);
        }
    }, [router]);

    return (
        <>
            <div className="text-center text-[25px] font-bold mb-6">회원가입</div>
            <Formik initialValues={initialValues} onSubmit={handleRegister}>
                {({ values, errors, touched, handleChange, handleSubmit }) => (
                    <div className="flex flex-col w-full md:w-1/2 gap-4 mb-4">
                        <Input
                            variant="bordered"
                            label="닉네임"
                            type="text"
                            value={values.nickname}
                            isInvalid={!!errors.nickname && !!touched.nickname}
                            errorMessage={errors.nickname}
                            onChange={handleChange("nickname")}
                        />
                        <Input
                            variant="bordered"
                            label="이메일"
                            type="email"
                            value={values.email}
                            isInvalid={!!errors.email && !!touched.email}
                            errorMessage={errors.email}
                            onChange={handleChange("email")}
                        />
                        <Input
                            variant="bordered"
                            label="비밀번호"
                            type="password"
                            value={values.password}
                            isInvalid={!!errors.password && !!touched.password}
                            errorMessage={errors.password}
                            onChange={handleChange("password")}
                        />
                        <Input
                            variant="bordered"
                            label="비밀번호 확인"
                            type="password"
                            value={values.confirmPassword}
                            isInvalid={!!errors.confirmPassword && !!touched.confirmPassword}
                            errorMessage={errors.confirmPassword}
                            onChange={handleChange("confirmPassword")}
                        />
                        {error && <Alert isClosable color="danger">{error}</Alert>}
                        <Button color="primary" isLoading={isRegLoading} variant="flat" onPress={handleSubmit}>회원가입</Button>
                    </div>
                )}
            </Formik>
            <div className="text-sm text-center text-gray-600 mt-4">
                계정을 이미 가지고 계신가요? <Button as={Link} href="/login" variant="light" color="primary" className="px-0">로그인</Button>
            </div>
        </>
    );
};
