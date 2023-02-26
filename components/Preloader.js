import { HashLoader } from "react-spinners";

export default function Preloader() {
    return (
        <div>
            <HashLoader speemultiplier={2} color={'blue'} />
        </div>
    );
}