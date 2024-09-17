import React from "react";

const Page = () => {
  return (
    <div className="flex flex-col space-y-3 items-center">
      <div className="border rounded-lg p-2 w-[900px] border-gray-600">
        <div className="text-2xl font-bold text-start">Basic info</div>
        <div className="flex flex-col">
          <Item>
            <Label>Name:</Label>
            <Value>Arman Maurya</Value>
          </Item>
          <Devider />
          <Item>
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
          </Item>
        </div>
      </div>
      <div className="border rounded-lg p-2 w-[900px] border-gray-600">
      <div className="text-2xl font-bold text-start">Contact info</div>

        <Item>
          <Label>Email:</Label>
          <Value>armanmarya6@gmail.com</Value>
        </Item>
        <Devider />
        <Item>
          <Label>
            Phone
          </Label>
          <Value>
            12345678
          </Value>
        </Item>
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
