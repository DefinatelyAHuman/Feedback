import type { MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import fs from "fs/promises";


export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};
  

export const loader = async () => {
  const feedbacks = await fs.readFile("feedbacks.json", "utf-8");
  const list= await JSON.parse(feedbacks); 
  return list ; 
};

export default function Index() {
  const  list  = useLoaderData(); 
  console.log(list);
  return (
    <>
    <div>Home</div>
    <div><Link to="/feedback">feedback</Link></div>
    
    </>
  );
}

