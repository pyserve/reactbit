type SimpleUserType = {
  id: number;
  display_name: string;
  first_name: string;
  last_name: string;
  email: string;
};

type UserType = {
  id: number;
  mutual_follows: number[];
  suggestions: number[];
  followers: number[];
  following: number[];
  password: string;
  last_login: string | null;
  is_superuser: boolean;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  is_staff: boolean;
  is_active: boolean;
  date_joined: string;
  display_name: string;
  dob: string | null;
  image: string | null;
  created_at: string;
  updated_at: string;
  groups: any[];
  user_permissions: any[];
  bio: string;
  website: string;
  cover: string;
  address: string;
};

type PostType = {
  id: number;
  caption: string;
  original_post: number;
  likes: number;
  comments: number;
  shared: number;
  saved: number;
  created_at: string;
  updated_at: string;
  user: number;
  is_shared: boolean;
  comments: string[];
  isLiked: boolean;
  isBookmarked: boolean;
  images: PostImageType[];
};

export interface RichTextEditorProps {
  /** Content of the editor */
  content: string;
  /** Extensions for the editor */
  extensions: AnyExtension[];

  /** Output format */
  output: "html" | "json" | "text";
  /** Model value */
  modelValue?: string | object;
  /** Dark mode flag */
  dark?: boolean;
  /** Dense mode flag */
  dense?: boolean;
  /** Disabled flag */
  disabled?: boolean;
  /** Label for the editor */
  label?: string;
  /** Hide toolbar flag */
  hideToolbar?: boolean;
  /** Disable bubble menu flag */
  disableBubble?: boolean;
  /** Hide bubble menu flag */
  hideBubble?: boolean;
  /** Remove default wrapper flag */
  removeDefaultWrapper?: boolean;
  /** Maximum width */
  maxWidth?: string | number;
  /** Minimum height */
  minHeight?: string | number;
  /** Maximum height */
  maxHeight?: string | number;
  /** Content class */
  contentClass?: string | string[] | Record<string, any>;
  /** Content change callback */
  onChangeContent?: (val: any) => void;
  /** Bubble menu props */
  bubbleMenu?: BubbleMenuProps;

  /** Use editor options */
  useEditorOptions?: UseEditorOptions;
}

export type fetchOrCreateConversationType = (participants: UserType[]) => void;

export type handleSendMessageType = ({
  message: string,
  sender: UserType,
}) => Promise<void>;

export type MessageType = {
  id: number;
  content: string;
  sender: UserType;
  timestamp: string;
  is_read: boolean;
  conversation: string;
};

export type ConversationType = {
  id: string;
  image?: string;
  participants: UserType[];
  created_at: string;
  messages: MessageType[];
};

export type PieAvatarProps = {
  participants: UserType[];
  size?: number;
  username?: string;
};

export type QueryParam = {
  key: string;
  value: string | number | boolean | null | undefined;
  operator?: "=" | "!=" | ">" | "<" | ">=" | "<=";
};

export type DataType = {
  model: string;
  query?: QueryParam[];
  enabled?: boolean;
};

export type SessionType = {
  user?: {
    id: number;
    name?: string;
    email?: string;
    image?: string | null;
    username: string;
  };
  token?: string;
  expiry?: number;
} | null;

export type PostImageType = {
  id: number;
  file: string;
};

export interface NotificationType {
  id: number;
  recipient: UserType;
  sender: UserType;
  notification_type:
    | "post"
    | "comment"
    | "message"
    | "like"
    | "follow"
    | "custom";
  message: string;
  content_type: number;
  object_id: number;
  content_object?: any;
  is_read: boolean;
  created_at: string;
}
