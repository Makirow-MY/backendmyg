import { Card, CardContent } from "./card";

import { useEffect, useRef } from "react";


const Processing = () => {
	const syncAttempted = useRef(false);

	useEffect(() => {
		
	}, []);

	return (
		<div className='h-screen w-full bg-black flex items-center justify-center'>
			  
					<h3 className='text-zinc-400 text-xl font-bold'>Logging you in</h3>
					<p className='text-zinc-400 text-sm'>Redirecting...</p>
				
		</div>
	);
};
export default Processing;
