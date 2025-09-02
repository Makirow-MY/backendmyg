const { useState, useEffect } = require("react");
const { default: toast } = require("react-hot-toast");
import axios from 'axios';

function useFetchData(url,{refresh}) {
     const [alldata, setAllData] = useState([]);
     const [loading, setLoading] = useState(true);
     const [initloading, setInitLoading] = useState(true);


     useEffect(() => {
                 if (initloading) {
                   setInitLoading(false);
                   setLoading(false) ;
                   return;
                 }
                 setLoading(true);

                 const fetchAllData = async()=>{
                    try {
                        const res = await axios.get(url);
                        const alldata = res.data.data;
                      //  console.log("res, alldata")
                        if (res.data.success) {
                            setAllData(alldata)
                        }
                        if (!res.data.success) {
                               toast.error(res.data.message)
                        }
                     //  setLoading(false)
                    } catch (error) {
                       //    setLoading(false)
                    }
                    finally{
                     setTimeout(() => {
                          setLoading(false)
                     }, 3000);
                        
                    }
                 }

                 if (url) {
                    fetchAllData()
                 }
     }, [initloading, url, alldata.length, refresh])

        return {alldata, loading}
}

export default useFetchData;