import {HiOutlinePhotograph} from 'react-icons/hi'

interface Props {
    photo?: string | null
    name: string
}

export const EventImage = ({photo, name}: Props) => (
    <div className="w-full h-40 mb-4 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
        {photo ? (
            <img src={photo} alt={name} className="w-full h-full object-cover"/>
        ) : (
            <div className="flex flex-col items-center text-gray-400">
                <HiOutlinePhotograph size={40}/>
                <span className="text-xs mt-1">нет обложки</span>
            </div>
        )}
    </div>
)
