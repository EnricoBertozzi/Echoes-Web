import pawIcon from "../../assets/paw-icon.svg";

export function AnimalIcon() {
  return (
    <div className="flex justify-center w-20 h-20 bg-[#3730A3] rounded-2xl min-w-24 min-h-24">
      <img src={pawIcon} alt="" className="w-18" />
    </div>
  )
}