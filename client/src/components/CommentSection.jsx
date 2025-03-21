import Comments from "./Comments"

export default function CommentSection(props){
  return (
    <div className="wrapper">
      <Comments data={props.data}/>
    </div>
  );
};