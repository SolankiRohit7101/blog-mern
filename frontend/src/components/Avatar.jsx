const Avatar = (prop) => {
  const { author, border } = prop;
  return (
    <>
      <div
        className={`flex justify-start  items-center ${border && "border-b-2"}
        gap-5 py-2 `}
      >
        <div className="relative w-10 h-10  cursor-pointer shadow-md overflow-hidden rounded-full     ">
          <img
            src={author?.profile_image}
            alt="profile image"
            loading="lazy"
            className="`rounded-full w-full h-full object-cover     "
          />
        </div>
        <div className="w-48">
          <h3 className=" text-lg md:text-2xl font-medium">{author?.name}</h3>
          <p className="text-justify text-balance  line-clamp-2 ">
            {author?.bio}
          </p>
        </div>
      </div>
    </>
  );
};
export default Avatar;
