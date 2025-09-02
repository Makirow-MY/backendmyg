import { BarLoader, DotLoader, PacmanLoader, ScaleLoader } from "react-spinners";

export default function Dataloading() {
    return <>
        <div className="loader">
            <div className="justify-content-center jimu-primary-loading">
                    <ScaleLoader color="var(--primary-color)"/>
            </div>
        </div>
    </>
}