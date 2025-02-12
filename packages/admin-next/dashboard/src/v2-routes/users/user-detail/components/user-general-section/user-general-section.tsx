import { PencilSquare, Trash } from "@medusajs/icons"
import { User } from "@medusajs/medusa"
import { Container, Heading, Text, clx, usePrompt } from "@medusajs/ui"
import { useAdminDeleteUser } from "medusa-react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { ActionMenu } from "../../../../../components/common/action-menu"

type UserGeneralSectionProps = {
  user: Omit<User, "password_hash">
}

export const UserGeneralSection = ({ user }: UserGeneralSectionProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const prompt = usePrompt()

  const { mutateAsync } = useAdminDeleteUser(user.id)

  const name = [user.first_name, user.last_name].filter(Boolean).join(" ")

  const handleDeleteUser = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("users.deleteUserWarning", {
        name: name ?? user.email,
      }),
      verificationText: name ?? user.email,
      verificationInstruction: t("general.typeToConfirm"),
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    await mutateAsync(undefined, {
      onSuccess: () => {
        navigate("..")
      },
    })
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading>{user.email}</Heading>
        <ActionMenu
          groups={[
            {
              actions: [
                {
                  label: t("actions.edit"),
                  to: "edit",
                  icon: <PencilSquare />,
                },
              ],
            },
            {
              actions: [
                {
                  label: t("actions.delete"),
                  onClick: handleDeleteUser,
                  icon: <Trash />,
                },
              ],
            },
          ]}
        />
      </div>
      <div className="grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("fields.name")}
        </Text>
        <Text
          size="small"
          leading="compact"
          className={clx({
            "text-ui-fg-subtle": !name,
          })}
        >
          {name ?? "-"}
        </Text>
      </div>
    </Container>
  )
}
