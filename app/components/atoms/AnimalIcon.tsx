import pawIcon from "../../assets/paw-icon.svg";

export function AnimalIcon() {
  return (
    <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-main sm:size-16">
      <img src={pawIcon} alt="" className="size-7 sm:size-8" />
    </div>
  );
}
