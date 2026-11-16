import pointIcon from "../../assets/point-icon.svg"

export function PointIcon() {
  return (
    <div className="flex justify-center w-16 h-16 bg-main rounded-2xl min-w-20 min-h-20">
      <img src={pointIcon} alt="" className="w-16" />
    </div>
  )
}