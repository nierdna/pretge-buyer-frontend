import { HeroVideoDialog } from './magicui/hero-video-dialog';

const DialogHowToPlay = () => {
  return (
    <HeroVideoDialog
      videoSrc="https://www.youtube.com/embed/hfuW_KH50_A?si=mrgCl5PiIK_ly39v"
      thumbnailSrc="https://img.youtube.com/vi/hfuW_KH50_A/maxresdefault.jpg"
      thumbnailAlt="Hero Video"
      isButtonPlay={true}
    />
  );
};

export default DialogHowToPlay;
