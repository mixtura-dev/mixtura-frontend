import { cva, type VariantProps } from 'class-variance-authority'

export const memberAvatarVariants = cva(
  'relative flex shrink-0 items-center justify-center rounded-full font-medium text-white overflow-hidden',
  {
    variants: {
      size: {
        xs: 'size-6 text-[10px]',
        sm: 'size-8 text-xs',
        md: 'size-10 text-sm',
        lg: 'size-14 text-lg',
        xl: 'size-20 text-2xl',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
)

export type MemberAvatarSize = NonNullable<VariantProps<typeof memberAvatarVariants>['size']>
