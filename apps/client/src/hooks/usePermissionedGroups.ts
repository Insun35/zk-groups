import { useCallback, useState } from "react"
import { Signer } from "ethers"
import { request, createIdentity } from "@utils"
import { environment } from "src/environments/environment"
import { Invite, Group } from "src/types"

type ReturnParameters = {
    validateCode: (inviteCode: string | undefined) => Promise<Invite>
    generateIdentityCommitment: (
        signer: Signer,
        groupName: string
    ) => Promise<string | null>
    joinGroup: (
        groupName: string,
        idCommitment: string,
        inviteCode: string
    ) => Promise<void>
    hasjoined: boolean
    loading: boolean
}

export default function usePermissionedGroups(): ReturnParameters {
    const [_loading, setLoading] = useState<boolean>(false)
    const [_hasJoined, setHasjoined] = useState<boolean>(false)

    const validateCode = useCallback(
        async (inviteCode: string | undefined): Promise<Invite> => {
            const codeInfo = await request(
                `${environment.apiUrl}/invites/${inviteCode}`
            )

            return codeInfo
        },
        []
    )

    const generateIdentityCommitment = useCallback(
        async (signer: Signer, groupName: string): Promise<string | null> => {
            setLoading(true)
            const identity = await createIdentity(
                (message) => signer.signMessage(message),
                groupName
            )
            const identityCommitment = identity.genIdentityCommitment()

            const hasJoined = await request(
                `${environment.apiUrl}/groups/${groupName}/${identityCommitment}`
            )

            setHasjoined(hasJoined)
            setLoading(false)
            return identityCommitment.toString()
        },
        []
    )

    const joinGroup = useCallback(
        async (
            groupName: string,
            idCommitment: string,
            inviteCode: string
        ): Promise<void> => {
            await request(
                `${environment.apiUrl}/groups/${groupName}/${idCommitment}/${inviteCode}`
            )
        },
        []
    )

    return {
        validateCode,
        generateIdentityCommitment,
        joinGroup,
        hasjoined: _hasJoined,
        loading: _loading
    }
}
