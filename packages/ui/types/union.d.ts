import { BasicItem } from './basic-item'
import { BasicItemProps } from './basic-item-props'
export declare type StructureItem = BasicItem & Omit<BasicItemProps, 'model'>
export declare type Structure = StructureItem[]
