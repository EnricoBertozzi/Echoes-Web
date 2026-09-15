import pointIcon from "../../assets/point-icon.svg"

export function PointIcon() {
  return (
    <div className="flex justify-center w-20 h-20 bg-main rounded-2xl min-w-24 min-h-24">
      <img src={pointIcon} alt="" className="w-18" />
    </div>
  )
}