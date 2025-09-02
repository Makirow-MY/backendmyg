import Aside from "./Aside";
import Header from "./Header";


function ParentComponent(props) {


    return ( 
        <div>
         <Header onToggleSidebar= {props.AsideOpener} setSearch={props.setSearch}
          search={props.search}  />
         <Aside isOpen={props.isOpen} onToggleSidebar= {props.AsideOpener} /> 
        </div>
    );
}

export default ParentComponent;
