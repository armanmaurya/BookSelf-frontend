import { cookies } from "next/headers";
import React from "react";

interface PersonalInfo {
  email: string;
  first_name: string;
  last_name: string;
}

const Page = async () => {
  const cookieStore = cookies();
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/account/personal-info/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Cookie: `${cookieStore.get("sessionid")?.name}=${
        cookieStore.get("sessionid")?.value
      }`,
    },
  });
  const data: PersonalInfo = await res.json();
  

  return (
    <div className="flex flex-col space-y-3 lg:items-center">
      <div className="border rounded-lg p-2 w-full lg:w-[900px] border-gray-600">
        <div className="text-2xl font-bold text-start">Basic info</div>
        <div className="flex flex-col">
          <Item>
            <Label>Name:</Label>
            <Value>{data.first_name} {data.last_name}</Value>
          </Item>
          {/* <Devider /> */}
          {/* <Item>
            <Label>
              Age:
            </Label>
            <Value>
              22
            </Value>
          </Item>
          <Devider />
          <Item>
            <Label>
              Gender:
            </Label>
            <Value>
              Male
            </Value>
          </Item> */}
        </div>
      </div>
      <div className="border rounded-lg p-2 w-full lg:w-[900px] border-gray-600">
      <div className="text-2xl font-bold text-start">Contact info</div>

        <Item>
          <Label>Email:</Label>
          <Value>{data.email}</Value>
        </Item>
        {/* <Devider /> */}
        {/* <Item>
          <Label>
            Phone
          </Label>
          <Value>
            12345678
          </Value>
        </Item> */}
      </div>
      <div className=""></div>
    </div>
  );
};

export default Page;

const Item = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex h-12 m-2 items-center">{children}</div>;
};

const Devider = () => {
  return <div className="w-full h-0.5 bg-gray-600"></div>;
};

const Label = ({ children }: { children: React.ReactNode }) => {
  return <div className="w-32 text-start">{children}</div>;
};

const Value = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
};
