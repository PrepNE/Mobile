import mobile_payment from "@/assets/images/undraw_mobile-payments_0u42.png"
import electricity from "@/assets/images/undraw_electricity_iu6d.png";
import scheldure from "@/assets/images/undraw_schedule_6t8k.png";


export const images  = {
    mobile_payment,
    electricity,
    scheldure
}



export const onboarding = [
  {
    id: 1,
    title: "Easily manage your electricity bills",
    description:
      "Track, pay, and manage your electricity usage all in one place — fast, simple, secure.",
    image: images.electricity, 
  },
  {
    id: 2,
    title: "Never miss a due date again",
    description:
      "Get timely reminders and pay your bills before the deadline to avoid disconnections.",
    image: images.scheldure, 
  },
  {
    id: 3,
    title: "Pay anytime, anywhere",
    description:
      "Use mobile money or cards to pay your electricity bills from the comfort of your home.",
    image: images.mobile_payment
  },
];

    

export const data = {
  onboarding,
};
