import {useContext, useState, useRef} from "react";
import { ethers } from "ethers";
import { useForm } from "react-hook-form";
import html2canvas from 'html2canvas';
import { AppSettingsContext } from "../../appSettingsContext";
import Logo from "../Logo";
import imageBgFootball from "../../images/bg-football.jpg";

function SetupEventForm() {
  const { contract } = useContext(AppSettingsContext);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [ eventType, setEventType ] = useState('');
  const previewRef = useRef(null);
  const [ previewTeam1Logo, setPreviewTeam1Logo ] = useState(null);
  const [ previewTeam2Logo, setPreviewTeam2Logo] = useState(null);
  const team1LogoReader = new FileReader();
  const team2LogoReader = new FileReader();

  const onSubmit = async ({ eventType, title, voteSize }) => {
    const imageUrl = '';
    const voteSizeParsed = ethers.utils.parseEther(voteSize);
    console.log({eventType, title, imageUrl, voteSizeParsed});
    // const eventId = await contract.setupEvent(eventType, title, imageUrl, voteSizeParsed);
    // console.log(eventId);
    html2canvas(previewRef.current).then((canvas) => {
      // upload file
      // document.body.appendChild(canvas);
    });
  };

  const handleChangeEventType = ({ target: { value }}) => {
    setEventType(value);
  };

  const handleTeam1LogoChange = ({ target: { files } }) => {
    const file = files[0];
    team1LogoReader.onloadend = () => setPreviewTeam1Logo(team1LogoReader.result);
    team1LogoReader.readAsDataURL(file);
  };

  const handleTeam2LogoChange = ({ target: { files } }) => {
    const file = files[0];
    team2LogoReader.onloadend = () => setPreviewTeam2Logo(team2LogoReader.result);
    team2LogoReader.readAsDataURL(file);
  };

  return (
    <>
      <h1 className="page-title">
        Setup new event
      </h1>

      <div className="flex sm:block">
        <form onSubmit={handleSubmit(onSubmit)} className="basis-1/2 sm:basis-full">
          <div className="form-group">
            <label htmlFor="eventType">Event type:</label>
            <select
              {...register('eventType', { required: true })}
              id="eventType"
              className="form-select"
              value={eventType}
              onChange={handleChangeEventType}
            >
              <option value="">Select...</option>
              <option value="0">Football</option>
            </select>
            {errors.eventType && <span className="text-red-400">Required</span>}
          </div>

          {eventType === '0' && <div className="flex gap-4">
            <div className="form-group basis-1/2">
              <label htmlFor="team1name">Team 1 name:</label>
              <input type="text" {...register('team1name', { required: true, maxLength: 100 })} id="team1name" className="form-input" />
              {errors.team1name && <span className="text-red-400">Required</span>}
            </div>

            <div className="form-group basis-1/2">
              <label htmlFor="team2name">Team 2 name:</label>
              <input type="text" {...register('team2name', { required: true, maxLength: 100 })} id="team2name" className="form-input" />
              {errors.team2name && <span className="text-red-400">Required</span>}
            </div>
          </div>}

          {eventType === '0' && <div className="flex gap-4">
            <div className="form-group basis-1/2">
              <label htmlFor="team1logo">Team 1 logo:</label>
              <input
                type="file"{...register('team1logo', { required: true })}
                id="team1logo"
                className="form-input p-1"
                onChange={handleTeam1LogoChange}
              />
              {errors.team1logo && <span className="text-red-400">Required</span>}
            </div>

            <div className="form-group basis-1/2">
              <label htmlFor="team2logo">Team 2 logo:</label>
              <input
                type="file"{...register('team2logo', { required: true })}
                id="team2logo"
                className="form-input p-1"
                onChange={handleTeam2LogoChange}
              />
              {errors.team2logo && <span className="text-red-400">Required</span>}
            </div>
          </div>}

          {/*<div className="form-group">
            <label htmlFor="title">Title:</label>
            <input type="text" {...register('title', { required: true, minLength: 10 })} id="title" className="form-input" />
            {errors.title && <span className="text-red-400">Required</span>}
          </div>*/}

          <div className="form-group">
            <label htmlFor="voteSize">Vote size:</label>
            <input type="number" step="0.00001" {...register('voteSize', { required: true })} id="voteSize" className="form-input" />
            {errors.voteSize && <span className="text-red-400">Required</span>}
          </div>

          <div className="form-group">
            <button type="submit" className="btn btn-gold" disabled={eventType === ''}>
              Submit
            </button>
          </div>
        </form>

        <div className="basis-1/2 sm:basis-full pl-8 sm:pl-0">
          <hr className="hidden sm:block my-4"/>
          <h1 className="subtitle text-center">
            Cover preview:
          </h1>
          {eventType === '0' && <div className="relative" ref={previewRef}>
            <img src={imageBgFootball} alt="preview"/>
            <div className="absolute flex w-full top-0 h-full border-gold-4">
              <div className="absolute left-1/2 -ml-14 bottom-3/4">
                <div className="m-auto">
                  <Logo color="white"/>
                </div>
              </div>
              {previewTeam1Logo && <div className="basis-1/2 flex">
                <div className="m-auto w-1/2 w-1/2 p-3 bg-white rounded-3xl aspect-square flex border-gold-4">
                  <img src={previewTeam1Logo} alt="team1logo" className="aspect-square object-contain m-auto"/>
                </div>
              </div>}
              {previewTeam1Logo && previewTeam2Logo && (
                <div className="text-white text-5xl top-1/2 absolute w-full text-center -rotate-45 -mt-5">VS</div>
              )}
              {previewTeam2Logo && <div className="basis-1/2 flex">
                <div className="m-auto w-1/2 w-1/2 p-3 bg-white rounded-3xl aspect-square flex border-gold-4">
                  <img src={previewTeam2Logo} alt="team2logo" className="aspect-square object-contain m-auto"/>
                </div>
              </div>}
            </div>
          </div>}
        </div>
      </div>
    </>
  );
}

export default SetupEventForm;
