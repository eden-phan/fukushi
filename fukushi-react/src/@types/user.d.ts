import { ProfileProps } from "./profile";

type UserProps = {
  profile_id: null;
  email: string;
  password: string;
  id: string;
  name: string;
  status: string;
  profile: ProfileProps;
};

type UserOptionProps = {
  user_id: number;
  fullname: string;
};
