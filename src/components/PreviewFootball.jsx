import imageBgFootball from "../images/bg-football.jpg";
import Logo from "./Logo";

function PreviewFootball({ previewTeam1Logo, previewTeam2Logo, showTheBusLogo, showVsText }) {
  return (
    <div className="relative">
      <img src={imageBgFootball} alt="preview"/>
      <div className="absolute flex w-full top-0 h-full border-gold-4">
        {showTheBusLogo && <div className="absolute left-1/2 -ml-14 bottom-3/4">
          <div className="m-auto">
            <Logo color="white"/>
          </div>
        </div>}
        {previewTeam1Logo && <div className="basis-1/2 flex">
          <div className="m-auto w-1/2 w-1/2 p-3 bg-white rounded-3xl aspect-square flex border-gold-4">
            <img src={previewTeam1Logo} alt="team1logo" className="w-full object-contain m-auto"/>
          </div>
        </div>}
        {previewTeam1Logo && previewTeam2Logo && showVsText && (
          <div className="text-white text-5xl top-1/2 absolute w-full text-center -rotate-45 -mt-5">VS</div>
        )}
        {previewTeam2Logo && <div className="basis-1/2 flex">
          <div className="m-auto w-1/2 w-1/2 p-3 bg-white rounded-3xl aspect-square flex border-gold-4">
            <img src={previewTeam2Logo} alt="team2logo" className="w-full object-contain m-auto"/>
          </div>
        </div>}
      </div>
    </div>
  );
}

export default PreviewFootball;
