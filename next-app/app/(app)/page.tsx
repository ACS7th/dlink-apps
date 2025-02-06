import Content from "@/components/home/content";
import type { NextPage } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

const Home: NextPage = () => {
    return <Content />;
};

export default Home;
