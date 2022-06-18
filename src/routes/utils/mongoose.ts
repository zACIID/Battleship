/**
 * Some mongoose utils like interface definitions for functions that return any
 */

/**
 * Interface that models the object returned by a mongoose delete/deleteOne called
 * on some collection
 */
export interface DeletionResult {
    deletedCount: number;
}
