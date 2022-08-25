import {useContext, useState, useRef} from "react";
import { ethers } from "ethers";
import { Moralis } from 'moralis';
import { useForm } from "react-hook-form";
import html2canvas from 'html2canvas';
import { AppSettingsContext } from "../../appSettingsContext";
import PreviewFootball from '../PreviewFootball';

function SetupEventForm() {
  const { contract } = useContext(AppSettingsContext);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [ eventType, setEventType ] = useState('');
  const [ previewTeam1Logo, setPreviewTeam1Logo ] = useState(null);
  const [ previewTeam2Logo, setPreviewTeam2Logo] = useState(null);
  const previewRef = useRef(null);
  const team1LogoReader = new FileReader();
  const team2LogoReader = new FileReader();

  const onSubmit = async ({ eventType, team1name, team2name, voteSize }) => {
    const voteSizeParsed = ethers.utils.parseEther(voteSize);
    await contract.setupEvent(
      eventType,
      team1name + ' vs ' + team2name,
      voteSizeParsed
    );
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
          <div ref={previewRef}>
            {eventType === '0' && (
              <PreviewFootball
                previewTeam1Logo={previewTeam1Logo}
                previewTeam2Logo={previewTeam2Logo}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default SetupEventForm;
