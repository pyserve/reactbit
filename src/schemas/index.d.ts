type SimpleUserType = {
  id: number;
  display_name: string;
  first_name: string;
  last_name: string;
  email: string;
};

type UserType = {
  id: number;
  mutual_follows: SimpleUserType[];
  suggestions: SimpleUserType[];
  followers: SimpleUserType[];
  following: SimpleUserType[];
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
};

type PostType = {
  id: number;
  caption: string;
  likes: number;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
    username: string;
    avatar: string;
    display_name: string;
  };
  comments: string[];
  isLiked: boolean;
  isBookmarked: boolean;
  images: string[];
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
