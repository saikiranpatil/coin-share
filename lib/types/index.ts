interface cashFlowDataProps {
    from: string;
    to: string;
    amount: number;
}

type cashFlowProps = cashFlowDataProps[];

type editAvatarType = "user" | "group";