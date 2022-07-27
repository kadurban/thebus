import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";

function EventBuckets() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { eventId } = useParams();

  useEffect(() => {
    console.log(eventId)
  }, []);

  return (
    <form className="flex flex-col max-w-xl w-full" onSubmit={handleSubmit(data => console.log(data))}>

      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input id="title" className="form-input" {...register("title", { required: true })} type="text"/>
        {errors.title && <span className="text-red-500">Title is required</span>}
      </div>

      <div className="form-group">
        <label>Outcome</label>
        {/*<div className="grid grid-cols-6">
          {[
            '0-0', '0-1', '0-2', '0-3', '0-4',
            '1-0', '1-1', '1-2', '1-3', '1-4',
            '2-0', '2-1', '2-2', '2-3', '2-4',
            '3-0', '3-1', '3-2', '3-3', '3-4',
            '4-0', '4-1', '4-2', '4-3', '4-4'
          ].map(text => (
            <div>
              {text}
            </div>
          ))}
        </div>*/}
      </div>

      <button className="btn btn-gold" type="submit">
        Next
`      </button>
    </form>
  );
}

export default EventBuckets;
