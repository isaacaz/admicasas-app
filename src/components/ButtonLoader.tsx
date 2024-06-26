import {
  TouchableOpacity,
  ActivityIndicator,
  TouchableOpacityProps,
  View,
} from "react-native";

type Props = TouchableOpacityProps & {
  classNameBtn?: string;
  disabled?: boolean;
  // children: JSX.Element | JSX.Element[];
  loading?: boolean;
};
export const ButtonLoader: React.FC<Props> = ({
  classNameBtn,
  disabled,
  loading,
  children,
  ...props
}) => {
  return (
    <TouchableOpacity
      {...props}
      className={classNameBtn + ` ${disabled ? "opacity-40" : ""}`}
      disabled={disabled}
      activeOpacity={0.6}
    >
      <View className="rounded-lg bg-primario-600 dark:bg-primario-600 p-3">
        {loading ? (
          <ActivityIndicator color={"#fff"} size={20} />
        ) : (
          <>{children}</>
        )}
      </View>
      {/*  <Texto className={${classNameLabel} text-center text-xl}>
          {children}
        </Texto> */}
    </TouchableOpacity>
  );
};
