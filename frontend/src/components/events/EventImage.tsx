import {HiOutlinePhotograph} from "react-icons/hi"

interface Props {
    photo?: string
    name: string
}

export const EventImage = ({photo, name}: Props) => {
    return (
        <div className="w-full h-40 mb-4 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
            {photo ? (
                <img src={photo} alt={name} className="w-full h-full object-cover"/>
            ) : (
                <div className="flex flex-col items-center text-gray-400">
                    <HiOutlinePhotograph size={40}/>
                    <span className="text-xs mt-1">извините, не успели сфотографировать</span>
                </div>
            )}
        </div>
    )
}

