// import { Bars } from "react-loader-spinner";
// import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
// import 'react-tabs/style/react-tabs.css';

import Image from "next/image";
import binaryBustersLogo from "./logo.jpg"


export default function Loading() {
  return (
    <div className="px-40 pt-12">
      <Image src={binaryBustersLogo} alt="binary Busters Logo" height={200} className="rounded-xl my-2"/>
      <h1 className="text-3xl pb-2">Binary Busters</h1>
      <p>We are <b>Binary Busters</b> a group of enthusiastic college freshmen eager to innovate and solve problems. Combining deverse skills in coding, design, and strategy, we are driven by curiosity and collaboration. Ready to dive into collaborationn. Ready to dive into challlenges and create impactful solutions, lets make something amazing together!</p>

      <h1 className="text-3xl pt-6 pb-2">Out Team Consists</h1>
      <ul className="pl-10">
        <li className="list-disc">Arman Maurya</li>
        <li className="list-disc">Devansh Dev Singh</li>
        <li className="list-disc">Apurv Verma</li>
        <li className="list-disc">Raghvendra Singh</li>
        <li className="list-disc">Vishesh Maurya</li>

      </ul>
    </div>
  );
}
