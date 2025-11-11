import { LoaderCircle } from "lucide-react";
import TextInput from "../../components/ui/textInput";

export default function DesignSystem() {
  return (
    <div className="px-5 flex">
      <div className="space-y-5 w-1/2">
        <h1 className="h1"> Title/Header 1 </h1>
        <h2 className="h2"> Header 2 </h2>
        <h3 className="h3"> Header 3 </h3>
        <h4 className="h4"> Header 4 </h4>
        
        <p className="label"> Label </p>
        <p className="body"> Subtitle/Body Large </p>
        <p className="body-bold"> Body BOLD</p>
        <p className="body"> Body REGULAR</p>
        <p className="body-small"> Body SMALL</p>
        <p className="body-subtle"> Body SUBTLE</p>

        <p className="web-small"> web small</p>
        <p className="password-small"> password small</p>
        <p className="link-small"> link small</p>
        <p className="web-body"> web Body</p>
        <p className="web-bold"> web body-bold</p>
      </div>
      <section className="w-2/3">
        <div className="space-x-5 my-5 ">
          <h3 className="h3"> Primary </h3>
          <button className="btn btn-primary ">Button Regular</button>
          <button className="btn btn-primary button-glow-primary">Button Clicked</button>
          <button className="btn btn-primary">Button Hover</button>
          <button className="btn btn-disabled"> Disable</button>
          <button className="my-3 btn btn-primary btn flex gap-2">Button Loading <LoaderCircle width={20} className="animate-spin" /> </button>
        </div>

        <div className="space-x-5 my-5 ">
          <h3 className="h3"> Secondary </h3>
          <button className="btn btn-sec">Button Regular</button>
          <button className="btn btn-sec button-glow-sec">Button Clicked</button>
          <button className="btn btn-sec">Button Hover</button>
          <button className="btn btn-disabled"> Disable</button>
          <button className="my-3 btn btn-sec btn flex gap-2">Button Loading <LoaderCircle width={20} className="animate-spin" /></button>
        </div>

        <div className="space-x-5 my-5">
          <h3 className="h3"> Tertiary </h3>
          <button className="btn btn-tertiary">Button Regular</button>
          <button className="btn btn-tertiary button-glow-tertiary">Button Clicked</button>
          <button className="btn btn-tertiary ">Button Hover</button>
          <button className="btn btn-disabled"> Disable</button>
          <button className="my-3 btn btn-tertiary flex gap-2">Button Loading <LoaderCircle width={20} className="animate-spin" /></button>
        </div>

        <TextInput 
            label="Textfield/Default"
            placeholder="Placeholder Text"
            value=""
            className=""
            onChange={() => {}}
        />
      </section>
    </div>
  );
}